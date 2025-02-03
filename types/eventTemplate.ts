export interface IEventTemplate {
    uid?: string,
    id?: string,
    designs: ITemplateDesign[]
}

export interface ITemplateDesign {
    type: string,
    mutable: {
        label: string,
        value: any,
    }
}

export interface ITemplateDragSouce {
    index: number,
    type: string,
}