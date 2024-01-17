class ApplicationController < ActionController::API
    # Get secret key from encrypted credentials file.
    def jwt_key
        Rails.application.credentials.jwt_key
    end

    # Create access jwt with 30 min expiry.
    def create_access_token(user)
        JWT.encode({sub: user.id, exp: Time.now.to_i + Constants::ACCESS_VALIDITY}, jwt_key, "HS256")
    end

    # Create refresh jwt with 30 days expiry.
    def create_refresh_token(user)
        JWT.encode({sub: user.id, exp: Time.now.to_i + Constants::REFRESH_VALIDITY}, jwt_key, "HS256")
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
end
