Vue.component('confirm',{
    template: "#confirm",
    props: {
        isActive: {
            type: Boolean,
            default: false
        },
        okOnly: {
            type: Boolean,
            default: false
        },
        message: {
            default:"Confirma?",
        },
        title: {
            default: "Info"
        }
    },
    data: function(){
        //return {isActive: true}
    },
    methods: {
        ok: function(){
           this.isActive=false;
           this.$emit('on-confirm');
        },
        cancel: function(){
            this.$emit('on-cancel');
        }
    }
});
