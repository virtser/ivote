class HomeController < ApplicationController

  # GET /home
  def index
  	root :to => "static#index"
  end

end
