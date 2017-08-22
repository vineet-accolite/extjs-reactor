# Ext JS Reactor KitchenSink

This project demonstrates the use of all [ExtReact](http://docs.sencha.com/extreact/latest/index.html) components.

## Running

ExtReact and all related packages are hosted on Sencha's private NPM registry. To gain access to this registry, [sign up for a trial of ExtReact](https://www.sencha.com/products/extreact/evaluate).

Once you have received your credentials, you can authenticate by running the following command:

```
npm login --registry=http://npm.sencha.com --scope=@extjs
```

If you do not have credentials, you can get them by [signing up for a trial of ExtReact](https://www.sencha.com/products/extreact/evaluate/).

Then, run the following to build and launch the app:

```
git clone https://github.com/sencha/extjs-reactor.git
cd packages/reactor-kitchensink
npm install
npm start
```

You can view the app by pointing your browser to [http://localhost:8084](http://localhost:8084)

# Running against a local copy of the SDK repo

1. `git clone git@github.com:sencha/extjs-reactor.git`
2. `npm install`
3. `cd packages/reactor-kitchensink`
4. `ln -s /path/to/ExtJS ext` - or, for Windows: `mklink ext /path/to/ExtJS` 
5. `npm run local`
