class UsersController < ApplicationController
    before_action :set_user, only: %i[ show update destroy change_password ]
    before_action :authenticate_user, only: %i[ update change_password destroy ]
    before_action :authenticate_refresh, only: %i[ refresh ]
    before_action :correct_user, only: %i[ update destroy change_password ]

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

    # Show specified user's profile.
    def show
        if logged_in? && (current_user.admin || current_user.id === @user) || @user.privacy
            render json: @user.attributes.slice("id", "username", "email", "created_at", "about", "ui_style", "privacy")
        else
            render json: @user.attributes.slice("id", "username", "privacy")
        end
    end

    # Show current user's own profile.
    def show_self
        render json: current_user.attributes.slice("id", "username", "email", "created_at", "about", "ui_style", "privacy")
    end
    
    def update
        @user.update!(profile_params)
    end

     # Authenticate old password and update new password.
     def change_password
        if @user.authenticate(change_password_params[:old_password])
            @user.update!(password: change_password_params[:password])
        else
            render json: {error: "Incorrect password."}, status: :unauthorized
        end
    end
    
    def destroy
        @user.destroy!
    end

    private

    def set_user
        @user = User.find_by(id: params[:id])
        render json: {error: "User not found."}, status: :unprocessable_entity if @user.nil?
    end


    def signup_params
        params.require(:user).permit(:username, :email, :password)
    end

    def signin_params
        params.require(:user).permit(:username, :password)
    end

    def profile_params
        params.require(:profile).permit(:username, :email, :about, :ui_style, :privacy)
    end

    def change_password_params
        params.require(:profile).permit(:old_password, :password)
    end

    # Authenticate access token.
    def authenticate_user
        render json: {error: "Not logged in."}, status: :unauthorized if !logged_in?
    end

    # Check user is querying their own profile before allowing update or destroy.
    def correct_user
        render json: {error: "Not authorized to perform this action."}, status: :unauthorized if current_user.id != @user.id && !current_user.admin
    end

    # Authenticate refresh token.
    def authenticate_refresh
        render json: {error: "Refresh token invalid."}, status: :unauthorized if !logged_in?
    end

    # Respond auth data for response.
    # Refresh token is created if remember is true.
    def respond_auth_data(remember)
        render json: {
            id: @user.id,
            username: @user.username,
            admin: @user.admin,
            access_token: create_token(@user, "ACCESS"),
            access_expiry: Time.now.to_i + Constants::ACCESS_VALIDITY,
            refresh_token: remember ? create_token(@user, "REFRESH") : "",
            refresh_expiry: Time.now.to_i + ( remember ? Constants::REFRESH_VALIDITY : 0 )
        }, status: :created
    end
end
