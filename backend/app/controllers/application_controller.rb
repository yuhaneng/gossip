class ApplicationController < ActionController::API
    # Get secret key from encrypted credentials file.
    def jwt_key
        Rails.application.credentials.jwt_key
    end

    # Create access or refresh token.
    def create_token(user, type)
        if type == "ACCESS"
            validity = Constants::ACCESS_VALIDITY
        elsif type == "REFRESH"
            validity = Constants::REFRESH_VALIDITY
        else
            validity = 0
        end
        JWT.encode({sub: user.id, exp: Time.now.to_i + validity, admin: user.admin}, jwt_key, "HS256")
    end
 
    # Decode token and check expiry.
    def decode_token(token)
        begin
            decoded_token = JWT.decode(token, jwt_key, true, { algorithm: 'HS256'}).first
        rescue => exception
            {error: "Invalid Token"}
        end
    end

    def header_token
        header = request.headers["Authorization"]
        if !header.nil?
            header[7..-1]
        else
            nil
        end
    end

    def user_id
        decode_token(header_token)["sub"]
    end

    def current_user
        user ||= User.find_by(id: user_id)
    end

    def logged_in?
        !!current_user
    end

    # Authenticate access token.
    def authenticate_user
        render json: {error: "Not logged in."}, status: :unauthorized if !logged_in?
      end
end
