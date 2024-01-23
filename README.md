# Setup

1. Install Postgres, Ruby, Rails, Node.js.
2. Install gems from backend.\
`bundle`
3. Install node modules from frontend.\
`npm install`
4. Edit backend/config/initializers/cors.rb, change origin to frontend port.
5. Edit frontend/src/features/users/usersApi.ts, change API_URL to backend port.
6. Setup database from backend.\
`rails db:setup`
7. Start backend server.\
`rails s`
8. Start frontend server.\
`npm start`