import webview

from pyfiles.detect import gravar

class MyJSAPI:
    def close(self):
        webview.windows[0].destroy()

    def minimize(self):
        webview.windows[0].minimize()

    def fullscreen(self):
        webview.windows[0].toggle_fullscreen()
    
    def detect(self,options):
        if 'Key' in options:
            call = options['Key']
        else:
            call = options['Voice']

        gravar(options['Name'], call, options['Option'])
                