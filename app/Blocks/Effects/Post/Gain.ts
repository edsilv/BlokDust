import {IApp} from '../../../IApp';
import IDisplayContext = etch.drawing.IDisplayContext;
import {MainScene} from '../../../MainScene';
import {PostEffect} from '../PostEffect';
import Point = etch.primitives.Point;

declare var App: IApp;

export class Gain extends PostEffect {

    public Effect: GainNode;
    //public Effect: Tone.Signal;
    public Params: GainParams;
    public Defaults: GainParams;

    Init(drawTo: IDisplayContext): void {

        this.BlockName = App.L10n.Blocks.Effect.Blocks.Volume.name;

        this.Defaults = {
            gain: 1.2
        };
        this.PopulateParams();

        this.Effect = App.Audio.ctx.createGain();
        this.Effect.gain.value = (this.Params.gain/10)+1;

        //this.Effect = new Tone.Signal(1, 'db');


        super.Init(drawTo);

        // Define Outline for HitTest
        this.Outline.push(new Point(-1, 0),new Point(0, -1),new Point(2, 1),new Point(0, 1));
    }

    Draw() {
        super.Draw();
        this.DrawSprite(this.BlockName);
    }

    Dispose(){
        this.Effect.disconnect();
        this.Effect = null;
    }

    SetParam(param: string,value: number) {
        super.SetParam(param,value);
        this.Effect.gain.value = (value/10)+1;
        this.Params[param] = value;
    }

    UpdateOptionsForm() {
        super.UpdateOptionsForm();

        this.OptionsForm =
        {
            "name": "Volume",
            "parameters": [
                {
                    "type" : "slider",
                    "name": "Gain",
                    "setting": "gain",
                    "props": {
                        "value": this.Params.gain,
                        "min": -10,
                        "max": 20,
                        "quantised": false,
                        "centered": true,
                    }
                }
            ]
        };
    }
}
