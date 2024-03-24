// Define the class Preloader.
class Preloader{
    // Constructor function for the Preloader class.
    constructor(options){
        // Object to store assets and their loading status.
        this.assets = {};
        // Iterate through each asset provided in options and initialize its loading status.
        for(let asset of options.assets){
            this.assets[asset] = { loaded:0, complete:false };
            // Load each asset.
            this.load(asset);
        }
        // Container element to display the progress bar.
        this.container = options.container;        
        // Check if the onprogress callback is defined in options.
        if (options.onprogress == undefined){
            // If not defined, use the default onprogress function.
            this.onprogress = onprogress;
            // Create a progress bar element.
            this.domElement = document.createElement("div");
            // Set styles for the progress bar container.
            this.domElement.style.position = 'absolute';
            this.domElement.style.top = '0';
            this.domElement.style.left = '0';
            this.domElement.style.width = '100%';
            this.domElement.style.height = '100%';
            this.domElement.style.background = '#000';
            this.domElement.style.opacity = '0.7';
            this.domElement.style.display = 'flex';
            this.domElement.style.alignItems = 'center';
            this.domElement.style.justifyContent = 'center';
            this.domElement.style.zIndex = '1111';
            // Create a base element for the progress bar.
            const barBase = document.createElement("div");
            barBase.style.background = '#aaa';
            barBase.style.width = '50%';
            barBase.style.minWidth = '250px';
            barBase.style.borderRadius = '10px';
            barBase.style.height = '15px';
            this.domElement.appendChild(barBase);
            // Create the progress bar element.
            const bar = document.createElement("div");
            bar.style.background = '#2a2';
            bar.style.width = '50%';
            bar.style.borderRadius = '10px';
            bar.style.height = '100%';
            bar.style.width = '0';
            barBase.appendChild(bar);
            // Store the progress bar element reference.
            this.progressBar = bar;
            // Append the progress bar to the container if provided, otherwise append it to the document body.
            if (this.container != undefined){
                this.container.appendChild(this.domElement);
            }else{
                document.body.appendChild(this.domElement);
            }
        }else{
            // If onprogress callback is defined in options, use it.
            this.onprogress = options.onprogress;
        }        
        // Set the oncomplete callback from options.
        this.oncomplete = options.oncomplete;        
        // Define an inner function for onprogress callback.
        const loader = this;
        function onprogress(delta){
            // Update the progress bar width based on the delta.
            const progress = delta*100;
            loader.progressBar.style.width = `${progress}%`;
        }
    }
    
    // Check if all assets are loaded.
    checkCompleted(){
        for(let prop in this.assets){
            const asset = this.assets[prop];
            if (!asset.complete) return false;
        }
        return true;
    }
    
    // Calculate the overall progress of loading.
    get progress(){
        let total = 0;
        let loaded = 0;        
        for(let prop in this.assets){
            const asset = this.assets[prop];
            if (asset.total == undefined){
                loaded = 0;
                break;
            }
            loaded += asset.loaded; 
            total += asset.total;
        }        
        return loaded/total;
    }
    
    // Load an asset.
    load(url){
        const loader = this;
        // Create a new XMLHttpRequest object to fetch the asset.
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', url, true); 
        xobj.onreadystatechange = function () {
              // Check if the request is complete and successful.
              if (xobj.readyState == 4 && xobj.status == "200") {
                  // Mark the asset as complete.
                  loader.assets[url].complete = true;
                  // Check if all assets are completed.
                  if (loader.checkCompleted()){
                      // Remove the progress bar element if exists.
                      if (loader.domElement != undefined){
                          if (loader.container != undefined){
                              loader.container.removeChild(loader.domElement);
                          }else{
                              document.body.removeChild(loader.domElement);
                          }
                      }
                      // Execute the oncomplete callback.
                      loader.oncomplete();    
                  }
              }
        };

        // Track progress of the asset loading.
        xobj.onprogress = function(e){
            const asset = loader.assets[url];
            asset.loaded = e.loaded;
            asset.total = e.total;
            loader.onprogress(loader.progress);
        }
        // Send the XMLHttpRequest to load the asset.
        xobj.send(null);
    }

    // Render method (not implemented).
    render() {
        return null;
    }
}

// Export the Preloader class.
export default Preloader;