

- ApplicationContext(config)
	- setParent(context)
	- getComponent(name)
	- getComponentFactory()

- ComponentFactory()
	- getComponent(name)
	- registerComponent(name, component)
	- registerComponentConfig(name, config)
	- containsComponent(name)
	- autowire(item, nameOrConfig)

	- resolveMethodArgs(name)

- ComponentConfig
	- scope 
	- lazy

	- fieldAttrs
	- methodAttrs
	- methodArgAttrs

	- initMethodName
	- destroyMethodName

- ComponentWrapper(componentPrototypeOrObject)
	- inst = new componentPrototypeOrObject
	- getWrappedInstance
	- setProperties(properties{name: value})
