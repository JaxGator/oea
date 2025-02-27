
import { type ToastActionElement, type ToastProps } from "@/components/ui/toast"
import { toast as sonnerToast, Toast } from "sonner"

type ToastOptions = Omit<ToastProps, "children">

export type ToasterToast = ToastOptions & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  info: 'info' as const,
  success: 'success' as const,
  warning: 'warning' as const,
  error: 'error' as const,
  default: 'default' as const
}

export const toastTypes = actionTypes

const TOAST_LIMIT = 20
const TOAST_REMOVE_DELAY = 3000

type ToasterToastState = {
  toasts: ToasterToast[]
}

// Export sonner toast directly for convenience
export const toast = sonnerToast;

let memoryState: ToasterToastState = { toasts: [] }

function dispatch(action: any) {
  memoryState = reducer(memoryState, action)
}

function reducer(state: ToasterToastState, action: any): ToasterToastState {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { id } = action

      // If the user-provided onDismiss, call it
      if (id) {
        const toast = state.toasts.find((t) => t.id === id)
        if (toast?.onDismiss) toast.onDismiss()
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
      }
    }

    case "REMOVE_TOAST":
      if (action.id === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      }

    default:
      return state
  }
}

export function useToast() {
  return {
    toast: (props: {
      title?: React.ReactNode
      description?: React.ReactNode
      variant?: "default" | "destructive"
      action?: ToastActionElement
    }) => {
      const { title, description, variant, action } = props;
      
      const id = Math.random().toString(36).substring(2, 9);
      
      const toastType = variant === "destructive" ? "error" : "default";
      
      const toastAction = action ? {
        action: {
          label: action.props.children,
          onClick: action.props.onClick,
        }
      } : {};
      
      if (toastType === "error") {
        toast.error(title as string, {
          description: description as string,
          id,
          ...toastAction
        });
      } else {
        toast(title as string, {
          description: description as string,
          id,
          ...toastAction
        });
      }
      
      // Also save to the memoryState for legacy components
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id,
          title,
          description,
          action,
          variant,
        },
      });
      
      return id;
    },
    dismiss: (id: string) => {
      dispatch({ type: "DISMISS_TOAST", id });
    },
    toasts: memoryState.toasts,
  }
}
