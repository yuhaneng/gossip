Rails.application.routes.draw do
  # Users routes.
  post '/signup', to: 'users#signup'
  post '/signin', to: 'users#signin'
  post '/refresh', to: 'users#refresh'

  get 'profile/self', to: 'users#show_self'
  get 'profile/:id', to: 'users#show'
  post 'profile/:id', to: 'users#update'
  put 'profile/:id', to: 'users#update'
  delete 'profile/:id', to: 'users#destroy'
  put 'profile/:id/password', to: 'users#change_password'

  # Posts routes.
  resources :posts, only: %i[ index show create update destroy ]
  post '/posts/:id/vote', to: 'posts#vote'

  # Comments routes.
  resources :comments, only: %i[ index show create update destroy ]
  post '/comments/:id/vote', to: 'comments#vote'

  # Replies routes.
  resources :replies, only: %i[ index show create update destroy ]
  post '/replies/:id/vote', to: 'replies#vote'

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
