
export default {
  
    props: 
    {
        auth: ''
    },
    
    data() {
        return {
                    ServerUrl: ''
              }
    },
    
    
    computed: {
 
    },
  
  
    
    methods: {
        getImg(){
            if (this.auth.isGlobalAdmin)
               return '../img/globaladmin.png';
            else
              return '../img/admin.png';
        },

        showProfileEvent() {
            this.$emit('showprofile-event', { eventData: 'Hello from the child component!' });
        },

        LogOut() {
            var data = {token: this.auth.SessToken};
            fetch(this.ServerUrl+'logout.php', {
                    headers: { 'Content-type': 'application/json' },
                    method: "DELETE",
                    body: JSON.stringify(data)
                  }).then(res=>res.json()).then((response) => {
                        console.log(response.result);
                        this.SessToken = '';
                        this.AdminDisplayName = 'Wylogowany';
                        this.showProfile = false;
                        this.IsAdminGlobal = false;
                        this.showPage = false;
                                
            }).catch( (error) => {
                console.log(error);
                this.ErrorMessage = error;
                });

            const url = new URL(document.URL);
            const protocol = url.protocol;
            const host = url.host;   
            location.href = protocol+'//'+host+'/';         
        },          
    },
    
    mounted() {
        console.log('LOAD MODULE: profile-ui');
        const url = new URL(document.URL);
        const protocol = url.protocol;
        const host = url.host;


        if (this.auth.isGlobalAdmin)
          this.AdminLogo = "./img/globaladmin.png";
        else
          this.AdminLogo = "./img/admin.png";

          console.log(this.AdminLogo);

        this.ServerUrl = protocol+'//'+host+'/api/v1/';
        console.log('SERVER: '+this.ServerUrl);
    },
    
    components: {
    },
  
    template: 
    `
    <div class="dropdown" >
    <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      <img :src="getImg()" alt="" width="32" height="32" class="rounded-circle me-2">
      {{ auth.DisplayName }}
    </a>
    <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
      <li><a class="dropdown-item" href="#" v-on:click="showProfileEvent">Profil</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#" v-on:click="LogOut">Wyloguj</a></li>
    </ul>
  </div>        
    `
  }
               
  