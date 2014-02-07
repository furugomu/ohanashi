# -*- ruby -*-

require './app'

use Rack::Static, urls: ['/images'], root: '.'

run Sinatra::Application
