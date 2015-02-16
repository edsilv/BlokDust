import IBlock = require("./IBlock");
import Block = require("./Block");
import IEffect = require("./IEffect");
import ISource = require("./ISource");
import Grid = require("../Grid");
import ObservableCollection = Fayde.Collections.ObservableCollection;

class Effect extends Block implements IEffect {

    public CatchmentArea: number = 6; // grid units
    public Effect; // ANY TYPE OF TONE POST EFFECT

    Source: ISource;
    public Sources: ObservableCollection<ISource> = new ObservableCollection<ISource>();

    constructor(grid: Grid, position: Point) {
        super(grid, position);

        this.OpenParams();
    }

    Update() {
        super.Update();
    }

    Attach(source: ISource): void {
        this.Source = source;
    }

    Detach(source: ISource): void {
        this.Source = source;
    }

    /**
     * Add source to this Effect's list of sources
     * @param source
     * @constructor
     */
    AddSource(source: ISource) {
        this.Sources.Add(source);
    }

    /**
     * Remove source from this Effect's list of sources
     * @param source
     * @constructor
     */
    RemoveSource(source: ISource) {
        this.Sources.Remove(source);
    }
}

export = Effect;