Web Bus v3, pure ES6 version.

(C) 2023 James Hickman - LGPL V 2.1

### Simple component system for Single Page Applications

Web Bus provides a minimal message passing, aka. Pub Sub, framework for assembling reusable
JavScript (ES6) components. This package provides a very minimal set of abilities with a small number of
essential add-ons.

## Essential features

Web Bus scans the page for DOM container elements that are marked with the class name "webbus_container".
A Web Bus container must have an ID and a data property named "logic". The data-logic property must reference a factory class passed to the Web Bus constructor.
Example of minimal mark-up for a Web Bus instance with the optional configuration object:

```
<div class="webbus_container" id="hello_world" data-logic="hello">
    <config style="display: none;">{'var': '123'}</config>
    <div class="content"></div>
</div>
```

The logic instantiated for any defined instance must extend the ComponentFactory class defined in lib/component.js
Example “Hello World” controller class:
```
class HelloWorld extends ComponentFactory {
    #el_container = null;
    _setup() {
        this.#el_container = this.el.querySelector('.content');
        const el_paragraph = document.createElement('P');
        el_paragraph.innerText = "From setup method. Configuration value: " + this.params.var;
        this.#el_container.appendChild(el_paragraph);
    }

    _start() {
        const el_paragraph = document.createElement('P');
        el_paragraph.innerText = "From start method. Global page value: " + this.web_bus.page_config('pagevar');
        this.#el_container.appendChild(el_paragraph);
    }
}
```
The Web Bus system needs to be started after the HTML code or an on-load page event handler. This example includes the optional page property with page scope variables.
```
new WebBus(
    {
        'page': {
            'pagevar': 98765
        },
        'factories': {
            'hello': HelloWorld
        }
    }
);
```

## Event passing system, PubSub

Instances communicate via the provided method this.web_bus.fire_event(“target_event”, data_Object)

Any public Controller method with a name starting with “event_” becomes a subscriber to messages sent by fire_event(). Optionally the string for the name of the event can be a path referencing the IDs on the parent DOM containers of a target instance. For example your can fire an event to “test1/test” that will only be received by an instance inside a DOM container with the ID of “test1”.

The fire_event() method returns an object with properties keyed to the IDs of the listening component instances with the value returned from the handler method.

## Instance life-cycle and hydration.

Each component factory Class implements a _setup() and _start() method. The _setup() method is called when the Web Bus system loads. The _start() is called when the instance becomes visible to the user or receives an event.

The _start() event exists for complex setup that should only be performed when the user can see it. This minimizes the time to interactivity of the overall application by deferring the _start() until the instance is actually needed to interact with the user.

# Model Adapter

An abstract class provides an abstract interface to a server API model. Include the file `adapter.js` and extend the class `ModelAdapter`.

The `call()` method calls a function defined in the operations object. Implementation of operations is in the `this.operations` static object. The properties of the operations contain functions to handle the operation. The first `call()` parameter must be a WebBus event identifier. Pass any other parameters the handler needs to `call()` after the event parameter. The handler is expected to call `this.wb.fire_event()` using the event name passed in with the results of the model operation. If the key `bearer` is set in localStorage, the method `get_bearer()` returns the token for passing on API requests.

### More information

See the tests/ and components/ directories for additional examples and complex reusable components.

See the project web site https://www.webbus.org

