json.array!(@users) do |user|
  json.extract! user, :id, :email, :first_name, :last_name, :phone, :date_of_birth
  json.url user_url(user, format: :json)
end
