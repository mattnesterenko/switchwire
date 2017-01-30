# Concepts

## Components
- Object or constructor function
- Scope: prototype, singleton (lazy/eager) [default], request (specific to express?)
- Lifecycle interceptors: init/destroy
- Events?
- aliases
- Exception management (for methods)?
- $inject: ['dep1', 'dep2']

## Context
- Manual dependency listing
- Dependency scanning (node only)
- Component Interceptors (pre, post)
- Method Interceptors (around, before, after)
- Exception Handlers
- getComponent()
- componentProvider
- setParent
- Destroy()

Primary context
- request context

# Annotations
- @Inject
- @InjectParam()
- @RestParam([paramName])
- @EnvironmentValue (value from config)
- @Env (environment var)

# Directives
'injectParams' - automatically tag all param names to a function before 



injections occur from the InjectonPostProcessor
values from EnvironmentValuePostProcessor

- context.get
    + scope.get
        * factory.create
            - Ensure not already creating an instance
            - Retrieve the component configuration
            - create(name, cfg)
                + Get primary instance
                + Create prototype wrapper and set prototype to new instance
                + Lifecycle: preMethodOverride()
                + Override and proxy any injected methods
                + Lifecycle: postMethodOverride()
                + Lifecycle: InjectionPreProcessor()
                + Delegate to post-processors
                    * Inject dependencies
                + Lifecycle: InjectionPostProcessor()
                + internal init lifecycle call
                + Register
                + Return


# Responsibilities
Context is the frontend facing API
    - It initializes the componentfactory
    - Start up the configuration extraction


Startup

1. Create context
2. Create component factory
   - prepare (add dependencies such as environment and what not)
   - initialize any component postprocessors
   - finish and init singletons

# OK, let's talk component configurations

For the context we need:

- All of the components defined

For all components, we need:

- The component's name
- The component's scope
- If the component is lazy or not
- All injected dependencies which are properties
- All injected dependencies which are method arguments
- Any lifecycle methods to call (init/destroy)
- Special attributes about the component that the factory needs to know about
    + Does it have any global method interceptors (before, around, after)
    + Does it have any pre/post processors for other components?
    + Does it have any postprocessors for the factory itself?

For REST controllers, we need:

- If the component is a REST controller
- Parent REST Controller
- The root HTTP path
- The HTTP Method for a function
- The HTTP Path for a function
- The HTTP variables to inject to the function
- The response type (JSON)? This should be simple for now...
