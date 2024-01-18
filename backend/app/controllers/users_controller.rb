class UsersController < ApplicationController
    before_action :authenticate_user, only: %i[ show update destroy ]
    before_action :authenticate_refresh, only: %i[ refresh ]

    # Create new user and respond with authentication data.
    def signup
        @user = User.new(signup_params)
        if @user.save
            respond_auth_data( params[:remember] == "yes" )
        else
            render json: {error: "User could not be created."}, status: :unprocessable_entity
        end
    end

    # Authenticate password and respond with authentication data.
    def signin
        @user = User.find_by(username: signin_params[:username])
        if @user && @user.authenticate(signin_params[:password])
            respond_auth_data( params[:remember] == "yes" )
        else
            render json: {error: "Incorrect username or password"}, status: :unauthorized
        end
    end

    # Respond with authentication data.
    def refresh
        @user = current_user
        respond_auth_data( true )
    end

    def show
        render json: current_user.attributes.slice("username", "email", "created_at")
    end
    
    def update
        current_user.update!(profile_params)
    end
    
    def destroy
        current_user.destroy!
    end

    private

    def signup_params
        params.require(:user).permit(:username, :email, :password)
    end

    def signin_params
        params.require(:user).permit(:username, :password)
    end

    def profile_params
        params.require(:profile).permit(:username, :email)
    end

    # Authenticate access token.
    def authenticate_user
        render json: {error: "Not logged in."}, status: :unauthorized if !logged_in?
    end

    # Authenticate refresh token.
    def authenticate_refresh
        render json: {error: "Refresh token invalid."}, status: :unauthorized if !logged_in?
    end

    # Respond auth data for response.
    # Refresh token is created if remember is true.
    def respond_auth_data(remember)
        render json: {
            username: @user.username,
            access_token: create_token(@user, "ACCESS"),
            access_expiry: Time.now.to_i + Constants::ACCESS_VALIDITY,
            refresh_token: remember ? create_token(@user, "REFRESH") : "",
            refresh_expiry: Time.now.to_i + ( remember ? Constants::REFRESH_VALIDITY : 0 )
        }, status: :created
    end
end
