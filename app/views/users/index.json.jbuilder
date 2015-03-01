json.array!(@users) do |user|
  json.extract! user, :id, :fbuser_id, :first_name, :last_name, :email, :device_token
  json.url user_url(user, format: :json)
end
