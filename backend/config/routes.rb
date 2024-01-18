Rails.application.routes.draw do
  # Users routes.
  post '/signup', to: 'users#signup'
  post '/signin', to: 'users#signin'
  post '/refresh', to: 'users#refresh'
  get '/profile', to: 'users#show'
  post '/profile', to: 'users#update'
  put '/profile', to: 'users#update'
  delete '/profile', to: 'users#destroy'

  # Posts routes.
  resources :posts, only: %i[ index show create update destroy ]

  # Comments routes.
  resources :comments, only: %i[ index show create update destroy ]

  # Replies routes.
  resources :replies, only: %i[ index show create update destroy ]

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
