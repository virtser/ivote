class HomeController < ApplicationController

  # GET /
  def index
  	root :to => "static#index"
  end

  # POST /fb
  def fb
  	redirect_to  '/client/'
  end

  # GET /results/1
  def results
  end

end
