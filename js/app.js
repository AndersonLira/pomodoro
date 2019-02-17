var app = new Vue({
    el: '#app',
    data: {
        days: '',
        hours:'',
        minutes:0,
        seconds:0,
        started: false,
        message: '',
        work: 25,
        short: 5,
        long: 15,
        base: 0,
        cycle: 0,
        isPause: false,
        isRunning:false,
        cron: null,
        begin: moment(),
        dict: undefined,
        overlayOpen:false,
        soundPopup: false,
    },
    created: function(){
        var data = localStorage.getItem("data");
        this.base = this.work;
        this.minutes = this.base;
        this.message = this.getLabel('progress_work');
        this.loadPersistence();
        if(this.isRunning){
            this.start();
        }
    },
    mounted() {
        var me = this;
        $(window).on('unload', function(){
            var obj = me.$data;
            var data = JSON.stringify(obj);
            localStorage.setItem("data",data);
        });    
    },
    computed: {
        cancelLabel: function() {
            return this.getLabel(this.isPause ? 'stop_rest': 'stop_pomodoro');
        },
        startLabel: function(){
            return this.getLabel(!this.isPause ? 'start_pomodoro': 'start_rest');
        }
    },
    methods: {
        updateTime: function(){
            var b = this.begin;
            var a = moment();
            var days = b.diff(a, 'days');
            var hours = b.diff(a,'hours');
            var minutes = b.diff(a,'minutes');
            var seconds = b.diff(a,'seconds');
            this.days = days;
            this.hours = hours % 24;
            this.minutes = minutes % 60;
            this.seconds = seconds % 60;
            if(this.minutes <= 0 && this.seconds <= 0){
                this.alarm();
                this.nextCycle();
            }

        },
        start: function(){
            if(!this.isRunning){
                this.begin = moment();
                this.begin.add(this.base,'minutes');
            }else{
                this.begin = moment(this.begin);
            }
            this.isRunning = true;
            this.cron = setInterval(this.updateTime,1000);
            if(this.isPause){
                this.message = this.getLabel('progress_rest');
            }else{
                this.message = this.getLabel('progress_work');
            }
        },
        cancel: function(){
            this.isRunning = false;
            if(this.isPause){
                this.base = this.work;
                this.isPause = false;
            }
            clearTimeout(this.cron);
            this.resetCron();
        },
        resetCron: function(){
            this.minutes = this.base;
            this.seconds = 0;
        },
        alarm: function(){
            var audio = document.getElementById("myAudio"); 
            audio.play();
            this.soundPopup = true;
            clearTimeout(this.cron);

        },
        getLabel: function(label){
            if(!this.dict){
                try{
                    this.dict = dictionaries['pt-br'];
                }catch(e){
                    console.error('dictionaries not found');
                }
            }
            return this.dict[label] ? this.dict[label]:label;
        },
        nextCycle: function(){
            if(!this.isPause){
                this.cycle++;
                if(this.cycle % 4 == 0) {
                    this.base = this.long;
                }else{
                    this.base = this.short;
                }
            }else{        
                this.base = this.work;
            }
            this.minutes = this.base;
            this.seconds = 0;
            this.isRunning = false;
            this.isPause = !this.isPause;

        },
        formatNum: function(num){
            var aux = "0" + num;
            return aux.length > 2 ? num : aux;
        },
        resetCounter: function(){
            this.cycle = 0;
            this.cancel();
            this.clearOverlay();
        },
        clearOverlay: function(){
            this.overlayOpen = false;
        },
        stopSound: function(){
            this.soundPopup = false;
            var audio = document.getElementById("myAudio"); 
            audio.currentTime = audio.duration;
        
        },
        loadPersistence: function(){
            var data = localStorage.getItem("data");
            if(data){
                var obj = JSON.parse(data);
                for(k in obj) {
                    this[k] = obj[k];
                }
                return obj;
            }
            return null;
        }
    }
});
