#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
./backend/bin/rails assets:precompile
./backend/bin/rails assets:clean
