echo "Running spellbook_md"
python manage.py spellbook_md --report-format=json --report-output=spellbook_md_report.json --report-level=detailed
gunicorn core.wsgi:application --bind 0.0.0.0:8080 --workers 3 --access-logfile - --error-logfile - --log-level info