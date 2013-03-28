Clarion::Application.routes.draw do


  get "galeria/index"

  resources :ingles

 resources :advertisements

  get "fotos/upload"

  get "sessions/new"

  get "users/new"
  get "galeria/index"

  resources :ingles
  resources :users
resources :sessions
resources :fotos



  #get "reservacion/index"

 # get "instalacion/index"

  resources :habitaciones
  match "instalaciones" => "instalacion#index"
  match "reservaciones"  => "reservacion#index"
  get "habitaciones/index"
  match "ingles" => "ingles#index"
  get "home/index"
  match "galeria" => "galeria#index"



match "sign_up" => "users#new"
match "promociones" => "sessions#new"
match "log_out" => "sessions#destroy"
match "upload" => "fotos#upload"


   root :to => 'home#index'
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
end