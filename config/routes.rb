Rails.application.routes.draw do

  root 'home#index'
  get '/fb' => 'home#fb'
  post '/fb' => 'home#fb'
  get '/results/:id' => 'home#results'

  scope '/api' do
    resources :relations
    resources :parties
    resources :users
    resources :votes

    scope '/votes' do
      get '/results/:user_id' => 'votes#results'
      get '/user/:user_id'    => 'votes#user'
    end

    scope '/connect' do
      post '/' => 'connect#create'
      get  '/user/:fb_id' => 'connect#user'
    end

    scope '/stream' do
      post '/post/:user_id' => 'stream#post'
      get  '/user/:user_id' => 'stream#user'
      get  '/flat/:user_id' => 'stream#flat'
      get  '/party/:party_id' => 'stream#party'
    end

  end

end
