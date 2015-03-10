class HomeController < ApplicationController

  # GET /home
  def index
  	root :to => "static#index"
  end

  # GET /results/1
  def results
  end

end
