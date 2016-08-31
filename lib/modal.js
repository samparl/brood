// (function() {

  function initializeEvents() {
    if(this.closeButton) {
      this.closeButton.addEventListener('click', this.close.bind(this));
    }

    if(this.overlay) {
      this.overlay.addEventListener('click', this.close.bind(this));
    }
  }

  Modal = function() {
    // Create global element references
    this.closeButton = null;
    this.modal = null;
    this.overlay = null;
    this.transitionEnd = transitionSelect();

    // Define option defaults
    var defaults = {
      className: 'fade-and-drop',
      closeButton: true,
      content: "",
      maxWidth: 600,
      minWidth: 300,
      overlay: true
    };

    // Create options by extending defaults with the passed in arguments
    if(arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }

  };


  // Public Methods


  Modal.prototype.open = function() {
    // debugger
    buildOut.call(this);
    // Initialize event listeners
    initializeEvents.call(this);
    window.getComputedStyle(this.modal).height;

    // Add open class and check if modal is taller than window
    // If taller, apply anchored class as well

    this.modal.className = this.modal.className +
      (this.modal.offsetHeight > window.innerHeight ?
        " scotch-open scotch-anchored" : " scotch-open");
    this.overlay.className = this.overlay.className + " scotch-open";
  };

  Modal.prototype.close = function() {
    // store value of this
    var _ = this;

    // Remove the open class name
    this.modal.className = this.modal.className.replace(" scotch-open", "");
    this.overlay.className = this.overlay.className.replace(" scotch-open", "");

    // Listen for CSS transitioned event and remove nodes from the DOM
    // debugger
    this.modal.addEventListener(this.transitionEnd, function() {
      _.modal.parentNode.removeChild(_.modal);
      if(_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
    });

  };

  function buildOut() {
    var content, contentHolder, docFrag;

    // If content is an HTML string, append it
    // If content is a domNode, append its content
    if(typeof this.options.content === "string") {
      content = this.options.content;
    } else {
      content = this.options.content.innerHTML;
    }

    docFrag = document.createDocumentFragment();
    this.modal = document.createElement("div");
    this.modal.className ="scotch-modal " + this.options.className;
    this.modal.style.minWidth = this.options.minWidth + "px";
    this.modal.style.maxWidth = this.options.maxWidth + "px";

    // If closeButton option is true, add a close button
    if(this.options.closeButton === true) {
      this.closeButton = document.createElement("button");
      this.closeButton.className = "scotch-close close-button";
      this.closeButton.innerHTML = "×";
      this.modal.appendChild(this.closeButton);
    }

    // Add an overlay if overlay is true
    if(this.options.overlay === true) {
      this.overlay = document.createElement("div");
      this.overlay.className = "scotch-overlay " + this.options.className;
      docFrag.appendChild(this.overlay);
    }

    // Create content area and append to modal
    contentHolder = document.createElement("div");
    contentHolder.className = "scotch-content";
    contentHolder.innerHTML = content;
    this.modal.appendChild(contentHolder);

    // Append modal to DocumentFragment
    docFrag.appendChild(this.modal);

    document.body.appendChild(docFrag);
  }

  function transitionSelect() {
    var el = document.createElement("div");
    if (el.style.WebkitTransition) return "webkitTransitionEnd";
    if (el.style.OTransition) return "oTransitionEnd";
    return 'transitionend';
  }

  function extendDefaults(source, properties) {
    var property;
    for(property in properties) {
      if(properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }
  module.exports = Modal;
// }());
