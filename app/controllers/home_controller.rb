class HomeController < ApplicationController

  # GET /home
  def index
  	root :to => "static#index"
  end

  # GET /share/1
  def share
  end

end
