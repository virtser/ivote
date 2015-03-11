Rails.application.routes.draw do

root 'home#index'
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
  end

  scope '/admin' do
    get '/resubs' => 'connect#resubs'
  end
end

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
