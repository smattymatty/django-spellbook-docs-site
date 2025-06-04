from django.shortcuts import render

def editor_base(request):
    template_name = 'editor/base.html'
    context = {}
    return render(request, template_name, context)