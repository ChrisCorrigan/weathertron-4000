<h1>Weathertron 4000</h1>
<p>Code challenge submission by Chris Corrigan. Does weather stuff.</p>
<p>More specifically: A weather component written in ES6 javascript which uses the openweathermap.org API</p>

<p>To install, first it requires an environment with Node and NPM. </p>
<p>Then install dependencies from package.json file with <code>npm install</code>.</p>
<p>I'm using webpack. Build scripts include: </p>
<ul>
    <li><code>npm build</code>: builds application to ./public</li>
    <li><code>npm watch</code>: automatically rebuilds on any file changes</li>
    <li><code>npm start</code>: builds, starts watch, and starts web server, opens page at localhost port 3000</li>
    <li><code>npm clear</code>: deletes built ./public directory</li>
</ul>
<p>Note: I'm currently having an issue with Webpack not building my CSS.. so for now I added npm-sass as well. To build the CSS, use: npm run scss</p>
<p>You'll have to refresh the page to load the latest css (watch isn't watching the CSS).</p>

