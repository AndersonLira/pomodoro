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
        accum:0,
        isPause: false,
        isRunning:false,
        cron: null,
        begin: moment(),
        dict: undefined,
        overlayOpen:false,
        soundPopup: false,
        sound: null,
        sounds: [],
        statistics:{},
        version: '1.7.1'
    },
    created: function(){
        //persisted data
        this.base = this.work;
        this.minutes = this.base;
        this.message = this.getLabel('progress_work');
        this.loadPersistence();
        //not persisted data
        this.dict = null;
        this.sounds = getSounds();
        if(!this.sound){
            this.sound = this.sounds[0];
        }
        if(this.isRunning){
            this.start();
        }
    },
    mounted() {
        var me = this;
        $(window).on('unload', function(){
            var obj = me.$data;
            var data = JSON.stringify(obj);
            localStorage.setItem("data-"+me.version,data);
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
                this.accum++;
                if(this.cycle % 4 == 0) {
                    this.base = this.long;
                }else{
                    this.base = this.short;
                }
                this.localStatistics();
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
        resetAccum: function(){
            this.accum = 0;
        },
        clearOverlay: function(){
            this.overlayOpen = false;
        },
        stopSound: function(){
            this.soundPopup = false;
            var audio = document.getElementById("myAudio"); 
            audio.currentTime = 0;
            audio.load();
        
        },
        loadPersistence: function(){
            var data = localStorage.getItem("data-"+this.version);
            if(data){
                this.clearOldData();
                var obj = JSON.parse(data);
                for(k in obj) {
                    this[k] = obj[k];
                }
                return obj;
            }
            return null;
        },
        clearOldData: function(){
            for (var key in localStorage){
                if(key.indexOf("data-") > -1 ){
                    localStorage.removeItem(key);
                }
             }
        },
        changeSound: function(){
            var size = this.sounds.length;
            var id = this.sound.id;
            var next = (id == size ? 0 : id);
            this.sound = this.sounds[next];
            var audio = document.getElementById("myAudio"); 
            audio.load();
        },
        localStatistics: function(){
            var d = new Date();
            var key = "Total " + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            var accum = localStorage.getItem(key);
            if(!accum){
                accum = 0;
            } 
            localStorage.setItem(key,parseInt(accum)+1);
        },

    }
});
