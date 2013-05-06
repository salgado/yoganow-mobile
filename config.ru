require 'sprockets'

map '/assets' do
  environment = Sprockets::Environment.new
  environment.append_path './'
  run environment
end
