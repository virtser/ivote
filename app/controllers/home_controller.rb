class HomeController < ApplicationController

  # GET /
  def index
  	root :to => "static#index"
  end

  # POST /fb
  def fb
  	redirect_to  'https://ivote.org.il/client/'
  end

  # GET /results/1
  def results
  end

end
