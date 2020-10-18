export const showPendingToast = (context, message = null, options = {}) => {
    const h = context.$createElement;
    const vNodesMsg = h(
        'div', {class: 'toast-wrapper'},
        [
            h('b-spinner', {props: { type: 'grow', small: true, variant: 'info' } }),
            h('div', {class: 'toast-message'}, [message || 'Pending Confirmation...'])
        ]
    )

    context.$bvToast.toast(
        [vNodesMsg], {
            variant: 'info',
            solid: true,
            noCloseButton: true,
            appendToast: true,
            toaster: 'b-toaster-bottom-left',
            autoHideDelay: 7000,
            ...options
        }
    )
}

export const showSuccessToast = (context, message = null, options = {}) => {
    const h = context.$createElement;

    const vNodesMsg = h(
        'div', {class: 'toast-wrapper'},
        [
           h('b-icon', { props: { icon: 'check', fontScale: 2}}),
           h('div', {class: 'toast-message'}, [message || 'Transaction Complete!'])
        ]
    )

    context.$bvToast.toast(
        [vNodesMsg], {
            variant: 'success',
            solid: true,
            noCloseButton: true,
            appendToast: true,
            toaster: 'b-toaster-bottom-left',
            ...options
        }
    )
}

export const showRejectedToast = (context, message = null, options = {}) => {
    const h = context.$createElement;

    const vNodesMsg = h(
        'div', {class: 'toast-wrapper'},
        [
           h('b-icon', { props: { icon: 'exclamation-circle', fontScale: 2}}),
           h('div', {class: 'toast-message'}, [message || 'Transaction Rejected.'])
        ]
    )

    context.$bvToast.toast(
        [vNodesMsg], {
            variant: 'warning',
            solid: true,
            noCloseButton: true,
            appendToast: true,
            toaster: 'b-toaster-bottom-left',
            ...options
        }
    )
}