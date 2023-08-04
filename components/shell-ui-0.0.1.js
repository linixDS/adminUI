import DomainsUi from './domains-ui-0.0.1.js';
import ClientsUi from './clients-ui-0.0.1.js';
import AdminsUi from './admins-ui-0.0.1.js';
import ProfileUi from './profile-ui-0.0.1.js';

export default {

        props:{
            token: '',
        },

        data(){
            return {
                ServerUrl: '',
                SessToken: '',
                ErrorMessage: '',
                AuthData: {},
                Pages: [
                            {name: 'HOME', show: true},
                            {name: 'CLIENTS', show: false, needAdmin: true},
                            {name: 'DOMAINS', show: false,  needAdmin: false},
                            {name: 'ADMINS', show: false,  needAdmin: false},
                            {name: 'USERS', show: false,  needAdmin: false},
                            {name: 'MAILS', show: false,  needAdmin: false}
                        ]
            }
        },

        components: {
            DomainsUi,
            ClientsUi,
            AdminsUi,
            ProfileUi,
        },        

        computed: {

        },

        methods: {
            LoadPage(name){
                let showPages = this.Pages.filter( page => page.show == true );
                for (const item of showPages){
                    item.show = false;
                }

                let Page = this.Pages.find( page => page.name.toUpperCase().includes(name.toUpperCase()) );
                if (Page)
                     Page.show = true;
            },

            IsViewPage(name){
               let Page = this.Pages.find( page => page.name.toUpperCase().includes(name.toUpperCase()) );
               if (Page){
                    if (Page.needAdmin){
                        if (this.AuthData.isGlobalAdmin)
                            return Page.show;
                        else
                            return false;
                    }
                        else
                    return Page.show;
               }
                else
                    return false;
            },

            Authorize() {
                const url = this.ServerUrl+'login.php?token='+this.SessToken;
                console.log(url);

                fetch(url)
                .then((res) => {
                  console.log('StatusCode: ' + res.status);
                  return res.json(); // Dodajemy return, aby zwrócić wynik jako Promise
                })
                .then((json) => {
                  console.log(json);
                  if (json.error) {
                    console.log(json.error);
                    this.ErrorMessage = json.error.message;
                  } else {
                    this.AuthData = json.result;
                  }
                })
                .catch((error) => {
                  console.log(error);
                  if (error == "TypeError: Failed to fetch")
                    this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.serverurl;
                  else
                    if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                        this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                    else
                      this.ErrorMessage = 'Wyjątek: ' + error;
                });

            }

         
        },

        mounted() {
            const url = new URL(document.URL);
            const protocol = url.protocol;
            const host = url.host;

            this.ServerUrl = protocol+'//'+host+'/api/v1/';

            let decodedWordArray =  CryptoJS.enc.Base64.parse(this.token);
            this.SessToken = decodedWordArray.toString(CryptoJS.enc.Utf8);

            this.Authorize();
        },
        
        template: 
        `
        <main class="d-flex flex-nowrap">
		<h1 class="visually-hidden">Sidebars</h1>

		<div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style="width: 280px;">
            <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              <span class="fs-4">AdminPanel</span>
            </a>
		        <hr>
            <ul class="nav nav-pills flex-column mb-auto">
              <li class="nav-item">
                <a href="#" v-bind:class="[IsViewPage('HOME') ? 'nav-link active' : 'nav-link text-white']" aria-current="page">
                  <i class="fas fa-home" style="color: white;"></i>
                  Home
                </a>
              </li>
              <li>
                <a href="#" v-bind:class="[IsViewPage('CLIENTS')  ? 'nav-link active' : 'nav-link text-white']" v-on:click="LoadPage('CLIENTS')">
                  <i class="fas fa-list" style="color: white;"></i>
                  Kontrahenci
                </a>
              </li>    
              <li>
                <a href="#" v-bind:class="[IsViewPage('DOMAINS') ? 'nav-link active' : 'nav-link text-white']" v-on:click="LoadPage('DOMAINS')">
                  <i class="fas fa-sitemap" style="color: white;"></i>
                  Domeny
                </a>
              </li>
              <li>
                <a href="#" v-bind:class="[IsViewPage('ADMINS') ? 'nav-link active' : 'nav-link text-white']" v-on:click="LoadPage('ADMINS')">
                  <i class="fas fa-user-shield" style="color: white;"></i>
                  Administratorzy
                </a>
              </li>
              <li>
                <a href="#" v-bind:class="[IsViewPage('USERS') ? 'nav-link active' : 'nav-link text-white']">
                  <i class="fas fa-user-friends" style="color: white;"></i>
                  Konta użytkowników
                </a>
              </li>
              <li>
                <a href="#" v-bind:class="[IsViewPage('MAILS') ? 'nav-link active' : 'nav-link text-white']">
                  <i class="fas fa-address-book" style="color: white;"></i>
                  Konta pocztowe
                </a>
              </li>      
            </ul>
		
		    <hr>
            <profile-ui  :auth="AuthData">
            </profile-ui>
    </div>

  
		<div class="b-example-divider b-example-vr"></div>
  
		<!--- Display content main --->
		<div style="margin: 30px 30px 30px 30px; width: 100%; overflow-x: hidden; overflow-y: auto;">
  
          <clients-ui v-if="IsViewPage('CLIENTS')"
                :auth="AuthData">
          </clients-ui>

          <domains-ui v-if="IsViewPage('DOMAINS')"
                :auth="AuthData">
          </domains-ui>


          <admins-ui v-if="IsViewPage('ADMINS')"
                :auth="AuthData">
          </admins-ui>
		</div>
    
	</main>
        `
} 