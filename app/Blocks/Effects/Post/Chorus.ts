import PostEffect = require("../PostEffect");
import Grid = require("../../../Grid");
import BlocksSketch = require("../../../BlocksSketch");

class Chorus extends PostEffect {

    public Effect: Tone.Chorus;
    public Params: ChorusParams;

    Init(sketch?: Fayde.Drawing.SketchContext): void {

        if (!this.Params) {
            this.Params = {
                rate: 2,
                delayTime: 2.22,
                depth: 0.9,
                feedback: 0.9,
            };
        }


        this.Effect = new Tone.Chorus({
            "rate" : this.Params.rate,
            "delayTime" : this.Params.delayTime,
            "type" : 'sine',
            "depth" : this.Params.depth,
            "feedback" : this.Params.feedback
        });

        super.Init(sketch);

        // Define Outline for HitTest
        this.Outline.push(new Point(-1, -1),new Point(0, -1),new Point(1, 0),new Point(0, 1),new Point(-1, 1));
    }

    Draw() {
        super.Draw();

        (<BlocksSketch>this.Sketch).BlockSprites.Draw(this.Position,true,"chorus");
    }

    Dispose() {
        this.Effect.dispose();
    }

    SetParam(param: string,value: number) {
        super.SetParam(param,value);
        var val = value;

        if (param=="rate") {
            this.Effect.frequency.value = val;
        } else if (param=="feedback") {
            this.Effect.feedback.value = val;
        } else {
            this.Effect[param] = val;
        }

        this.Params[param] = val;
    }

    /*GetParam(param: string) {
        super.GetParam(param);
        var val;
        if (param=="rate") {
            val = this.Effect.frequency.value;
        } else if (param=="delayTime") {
            val = this.Effect.delayTime;
        } else if (param=="depth") {
            val = this.Effect.depth;
        } else if (param=="feedback") {
            val = this.Effect.feedback.value;
        }

        return val;
    }*/

    UpdateOptionsForm() {
        super.UpdateOptionsForm();

        this.OptionsForm =
        {
            "name" : "Chorus",
            "parameters" : [

                {
                    "type" : "slider",
                    "name" : "Rate",
                    "setting" :"rate",
                    "props" : {
                        "value" : this.Params.rate,
                        "min" : 0,
                        "max" : 5,
                        "quantised" : false,
                        "centered" : false
                    }
                },

                {
                    "type" : "slider",
                    "name" : "Delay Time",
                    "setting" :"delayTime",
                    "props" : {
                        "value" : this.Params.delayTime,
                        "min" : 0,
                        "max" : 5,
                        "quantised" : false,
                        "centered" : false
                    }
                },

                {
                    "type" : "slider",
                    "name" : "Depth",
                    "setting" :"depth",
                    "props" : {
                        "value" : this.Params.depth,
                        "min" : 0,
                        "max" : 1,
                        "quantised" : false,
                        "centered" : false
                    }
                },

                {
                    "type" : "slider",
                    "name" : "Feedback",
                    "setting" :"feedback",
                    "props" : {
                        "value" : this.Params.feedback,
                        "min" : 0,
                        "max" : 1,
                        "quantised" : false,
                        "centered" : false
                    }
                }
            ]
        };
    }
}

export = Chorus;