var app = new Vue({
    el: '#app',
    data: {
        days: '',
        hours:'',
        minutes:'',
        seconds:'',
        started: false,
        message: 'Pomodoro em progresso',
        work: 25,
        short: 5,
        long: 15,
        cycle: 0,
        base: 1,
        isPause: false,
        cron: null,
        begin: moment()
    },
    methods: {
        updateTime: function(){
            var a = this.begin;
            //var b = moment("2018-11-27T06:00:00.000Z");
            var b = moment();
            var days = b.diff(a, 'days');
            var hours = b.diff(a,'hours');
            var minutes = b.diff(a,'minutes');
            var seconds = b.diff(a,'seconds');
            this.days = days;
            this.hours = hours % 24;
            this.minutes = minutes % 60;
            this.seconds = seconds % 60;
            if(this.minutes >= this.base){
                this.alarm();
                this.cycle++;
            }

        },
        start: function(){
            this.begin = moment();
            this.cron = setInterval(this.updateTime,1000);
        },
        stop: function(){
            clearTimeout(this.cron);
            console.log('stope');
        },
        alarm: function(){
            var x = document.getElementById("myAudio"); 
            x.play();
            clearTimeout(this.cron);

        }
    }
});
