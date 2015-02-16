class User < ActiveRecord::Base
	has_one :vote
end
