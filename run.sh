echo "Running spellbook_md"
python manage.py spellbook_md --report-format=json --report-output=spellbook_md_report.json --report-level=detailed
echo "Starting Development Server"
python manage.py runserver