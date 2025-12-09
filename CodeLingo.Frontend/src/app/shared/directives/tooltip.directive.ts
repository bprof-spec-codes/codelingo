import { Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy } from '@angular/core';

@Directive({
    selector: '[appTooltip]',
    standalone: false
})
export class TooltipDirective implements OnDestroy {
    @Input('appTooltip') tooltipText: string = '';
    private tooltipElement: HTMLElement | null = null;
    private showTimeout: any;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('mouseenter') onMouseEnter() {
        if (!this.tooltipText) return;
        this.showTimeout = setTimeout(() => {
            this.showTooltip();
        }, 200); // Small delay
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.hideTooltip();
    }

    @HostListener('click') onClick() {
        this.hideTooltip();
    }

    private showTooltip() {
        if (this.tooltipElement) return;

        this.tooltipElement = this.renderer.createElement('div');
        this.renderer.addClass(this.tooltipElement, 'custom-tooltip');
        const text = this.renderer.createText(this.tooltipText);
        this.renderer.appendChild(this.tooltipElement, text);
        this.renderer.appendChild(document.body, this.tooltipElement);

        const hostPos = this.el.nativeElement.getBoundingClientRect();
        const tooltipPos = this.tooltipElement!.getBoundingClientRect();

        const top = hostPos.bottom + 8; // Position below
        const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

        this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
        this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
    }

    private hideTooltip() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
            this.tooltipElement = null;
        }
    }

    ngOnDestroy() {
        this.hideTooltip();
    }
}
