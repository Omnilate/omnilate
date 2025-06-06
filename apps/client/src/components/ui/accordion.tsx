import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionTriggerProps
} from '@kobalte/core/accordion'
import { Accordion as AccordionPrimitive } from '@kobalte/core/accordion'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { splitProps } from 'solid-js'
import type { ParentProps, ValidComponent } from 'solid-js'

import { cn } from '@/utils/cn'

export const Accordion = AccordionPrimitive

type accordionItemProps<T extends ValidComponent = 'div'> =
  AccordionItemProps<T> & {
    class?: string;
  }

export const AccordionItem = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, accordionItemProps<T>>
) => {
  const [local, rest] = splitProps(props as accordionItemProps, ['class'])

  return (
    <AccordionPrimitive.Item class={cn('b-0 b-b b-border b-solid', local.class)} {...rest} />
  )
}

type accordionTriggerProps<T extends ValidComponent = 'button'> = ParentProps<
  AccordionTriggerProps<T> & {
    class?: string;
  }
>

export const AccordionTrigger = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, accordionTriggerProps<T>>
) => {
  const [local, rest] = splitProps(props as accordionTriggerProps, [
    'class',
    'children'
  ])

  return (
    <AccordionPrimitive.Header as="div" class="flex">
      <AccordionPrimitive.Trigger
        class={cn(
          'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-shadow hover:underline [&[data-expanded]>svg]:rotate-180 bg-inherit focus-visible:(outline-none ring-1.5 ring-ring)',
          local.class
        )}
        {...rest}
      >
        {local.children}
        <svg
          class="h-4 w-4 text-muted-foreground transition-transform duration-200"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m6 9l6 6l6-6"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
          <title>Arrow</title>
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

type accordionContentProps<T extends ValidComponent = 'div'> = ParentProps<
  AccordionContentProps<T> & {
    class?: string;
  }
>

export const AccordionContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, accordionContentProps<T>>
) => {
  const [local, rest] = splitProps(props as accordionContentProps, [
    'class',
    'children'
  ])

  return (
    <AccordionPrimitive.Content
      class={cn(
        'animate-accordion-up overflow-hidden text-sm data-[expanded]:animate-accordion-down',
        local.class
      )}
      {...rest}
    >
      <div class="pb-4 pt-0">{local.children}</div>
    </AccordionPrimitive.Content>
  )
}
