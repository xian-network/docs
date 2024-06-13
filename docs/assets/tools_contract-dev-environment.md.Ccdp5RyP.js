import{_ as e,c as t,o,a3 as n}from"./chunks/framework.BTdubn_4.js";const v=JSON.parse('{"title":"Contract Dev Environment","description":"A standardised environment for developing and testing smart contracts on Xian.","frontmatter":{"title":"Contract Dev Environment","description":"A standardised environment for developing and testing smart contracts on Xian."},"headers":[],"relativePath":"tools/contract-dev-environment.md","filePath":"tools/contract-dev-environment.md"}'),i={name:"tools/contract-dev-environment.md"},c=n('<h1 id="contract-dev-environment" tabindex="-1">Contract Dev Environment <a class="header-anchor" href="#contract-dev-environment" aria-label="Permalink to &quot;Contract Dev Environment&quot;">​</a></h1><h2 id="setup-guide" tabindex="-1">Setup Guide <a class="header-anchor" href="#setup-guide" aria-label="Permalink to &quot;Setup Guide&quot;">​</a></h2><p><em>This is a standardised environment for developing and testing smart contracts on Xian.</em></p><div class="info custom-block"><p class="custom-block-title">Installation</p><ol><li>Install Docker</li></ol><ul><li><a href="https://docs.docker.com/desktop/install/mac-install/" target="_blank" rel="noreferrer">MacOS</a></li><li><a href="https://docs.docker.com/desktop/install/windows-install/" target="_blank" rel="noreferrer">Windows</a></li><li>Linux <ul><li><code>curl -fsSL https://get.docker.com -o get-docker.sh</code></li><li><code>sudo sh get-docker.sh</code></li><li><code>sudo curl -L &quot;https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)&quot; -o /usr/local/bin/docker-compose</code></li><li><code>sudo chmod +x /usr/local/bin/docker-compose</code></li></ul></li></ul><ol start="2"><li><code>git clone https://github.com/xian-network/contract-dev-environment.git</code></li><li><code>cd contract-dev-environment</code></li><li><code>make build</code></li></ol></div><div class="info custom-block"><p class="custom-block-title">Usage</p><ol><li>Run <code>make test-shell</code> from cli <ul><li>This will open a command shell inside the container</li></ul></li><li>Develop your contracts &amp; tests in <code>/contracts</code></li><li>To execute your tests : <ul><li><code>pytest tests/test.py</code> from the shell</li></ul></li><li>To exit the test shell type <code>exit</code></li><li>Happy coding !</li></ol></div>',5),l=[c];function a(s,r,d,m,u,p){return o(),t("div",null,l)}const _=e(i,[["render",a]]);export{v as __pageData,_ as default};
