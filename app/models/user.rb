class User < ActiveRecord::Base
	has_one :vote
	has_many :relation
end
