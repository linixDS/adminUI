export default {

    props:{
        ErrorMessage: ''
    },

    data(){
        return {
            showSpinLoading: false,
            username: '',
            password: ''
        }
    },

    computed: {
        isDisableButton: function(){
            if  (this.username.length < 3)
                return true;
            if  (this.password.length < 3)
                return true;
            if (this.showSpinLoading)
                return true;
              
            return false;
        }
    },

    methods: {

        onLoginSend(){
            console.log('Login');
            this.showSpinLoading = true;
            this.isDisableButton = true;
        },

        onSubmit() {

        }
    },

    mounted() {
        const url = new URL(document.URL);
        const protocol = url.protocol;
        const host = url.host;

    },    
    

    template: 
    `
    <div class="container">


        <div class="row">

            <div class="col-lg-3 col-md-2"></div>
            <div class="col-lg-6 col-md-8 login-box">
                <div class="col-lg-12 login-key">
                    <i class="fa fa-key" aria-hidden="true"></i>
                </div>
                <div class="col-lg-12 login-title">
                    ADMIN PANEL
                </div>

                <div class="col-lg-12 login-form">
                    <div class="col-lg-12 login-form">
                        <form action="./index.php" method="POST" >
                            <div class="form-group">
                                <label class="form-control-label">LOGIN:</label>
                                <input type="text" class="form-control" v-model="username" name="username">
                            </div>
                            <div class="form-group">
                                <label class="form-control-label">HASŁO:</label>
                                <input type="password" class="form-control" v-model="password" name="password">
                            </div>

                            <div class="col-lg-12 login-btm">
                                <div class="col-lg-6 login-btm text-error">
                                   {{ ErrorMessage }}
                                </div>
                                <div class="col-lg-6 login-btm login-button" >
                                    <button class="btn btn-outline-primary" :disabled="isDisableButton" @click="onLoginSend">
                                        <div v-if="showSpinLoading" class="spinner-border text-white spinner-border-sm" role="status"></div>
                                        Zaloguj
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-lg-3 col-md-2"></div>
            </div>
        </div>
    </div>    
    `
}