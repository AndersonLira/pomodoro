var app = new Vue({
    el: '#app',
    data: {
        days: '',
        hours:'',
        minutes:0,
        seconds:0,
        started: false,
        message: 'Pomodoro em progresso',
        work: 25,
        short: 5,
        long: 15,
        base: 0,
        cycle: 10,
        isPause: false,
        isRunning:false,
        cron: null,
        begin: moment(),
        dict: undefined,
        overlayOpen:false,
    },
    created: function(){
        this.base = this.work;
        this.minutes = this.base;
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
            //var b = moment("2018-11-27T06:00:00.000Z");
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
            this.isRunning = true;
            this.begin = moment();
            this.begin.add(this.base,'minutes')
            this.cron = setInterval(this.updateTime,1000);
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
            var x = document.getElementById("myAudio"); 
            x.play();
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
        }
    }
});
