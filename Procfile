release: cd app && python manage.py migrate
web: cd app && daphne app.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: cd app && python manage.py runworker channels -v2
