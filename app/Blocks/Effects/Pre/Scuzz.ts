import IDisplayContext = etch.drawing.IDisplayContext;
import Point = etch.primitives.Point;
import {IApp} from '../../../IApp';
import {IAudioChain} from '../../../Core/Audio/Connections/IAudioChain';
import {ISource} from '../../ISource';
import {MainScene} from '../../../MainScene';
import {PreEffect} from '../PreEffect';

declare var App: IApp;

export class Scuzz extends PreEffect {

    public OscLFO: Tone.LFO;
    public SamplerLFO: Tone.LFO;
    public Params: ScuzzParams;
    public Defaults: ScuzzParams;

    Init(drawTo: IDisplayContext): void {

        this.BlockName = App.L10n.Blocks.Effect.Blocks.Scuzz.name;

        this.Defaults = {
            depth: 1000,
            rate: 100,
            waveform: 2
        };
        this.PopulateParams();

        this.OscLFO = new Tone.LFO();
        this.SamplerLFO = new Tone.LFO();
        this.OscLFO.frequency.value = this.Params.rate;
        this.SamplerLFO.frequency.value = this.Params.rate;
        this.OscLFO.min = -this.Params.depth;
        this.SamplerLFO.min = Scuzz.ConvertLFODepthToPlaybackDepth(-this.Params.depth);
        this.OscLFO.max = this.Params.depth;
        this.SamplerLFO.max = Scuzz.ConvertLFODepthToPlaybackDepth(this.Params.depth);
        this.OscLFO.type = App.Audio.WaveformTypeIndex[this.Params.waveform];
        this.SamplerLFO.type = App.Audio.WaveformTypeIndex[this.Params.waveform];
        this.OscLFO.start();
        this.SamplerLFO.start();

        super.Init(drawTo);

        // Define Outline for HitTest
        this.Outline.push(new Point(-1, -1),new Point(2, -1),new Point(0, 1),new Point(-1, 0));
    }

    //TODO: This should extend from LFO instead
    static ConvertLFODepthToPlaybackDepth(val): number {
        return (val/400) + 1;
    }

    Draw() {
        super.Draw();
        this.DrawSprite(this.BlockName);
    }

    UpdateConnections(chain: IAudioChain) {
        super.UpdateConnections(chain);

        this.OscLFO.disconnect();
        this.SamplerLFO.disconnect();

        chain.Sources.forEach((source: ISource) => {
            source.Sources.forEach((s: any) => {
                if ((<Tone.Oscillator>s).detune) {
                    this.OscLFO.connect((<Tone.Oscillator>s).detune);
                } else if ((<Tone.Simpler>s).player && (<Tone.Simpler>s).player.playbackRate) {
                    this.SamplerLFO.connect((<Tone.Simpler>s).player.playbackRate);
                }  else if ((<Tone.Noise>s).playbackRate) {
                    this.SamplerLFO.connect((<Tone.Noise>s).playbackRate);
                }
            });
        });
    }

    Dispose(){
        this.OscLFO.stop();
        this.SamplerLFO.stop();
        this.OscLFO.dispose();
        this.SamplerLFO.dispose();
    }

    SetParam(param: string,value: number) {
        super.SetParam(param,value);
        var val = value;

        if (param=="rate") {
            this.OscLFO.frequency.value = val;
            this.SamplerLFO.frequency.value = val;
        } else if (param=="depth") {
            this.OscLFO.min = -val;
            this.SamplerLFO.min = Scuzz.ConvertLFODepthToPlaybackDepth(-val);
            this.OscLFO.max = val;
            this.SamplerLFO.max = Scuzz.ConvertLFODepthToPlaybackDepth(val);
        } else if (param=="waveform") {
            this.OscLFO.type = App.Audio.WaveformTypeIndex[val];
            this.SamplerLFO.type = App.Audio.WaveformTypeIndex[val];
        }
        this.Params[param] = val;
    }

    UpdateOptionsForm() {
        super.UpdateOptionsForm();

        this.OptionsForm =
        {
            "name" : "Scuzz",
            "parameters" : [

                {
                    "type" : "slider",
                    "name" : "Power",
                    "setting" :"depth",
                    "props" : {
                        "value" : this.Params.depth,
                        "min" : 1000,
                        "max" : 10000,
                        "quantised" : true,
                        "centered" : false
                    }
                },
                {
                    "type" : "slider",
                    "name" : "Pulverisation",
                    "setting" :"rate",
                    "props" : {
                        "value" : this.Params.rate,
                        "min" : 100,
                        "max" : 10000,
                        "quantised" : true,
                        "centered" : false
                    }
                }
            ]
        };
    }
}
