web: daphne app.app.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: python app/manage.py runworker channels -v2
