import React from "react";
import Button from "./Button";

export default function Modal({
  title,
  show,
  onClose,
  footer = true,
  onUpdate,
  children,
}) {
  return (
    <>
      {show && (
        <>
          <div className="fixed inset-0 z-[51] flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative z-[51] m-4 w-auto max-w-3xl sm:m-6">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-between rounded-t border-b border-solid border-slate-200 p-4 dark:border-gray-500 dark:bg-gray-800 dark:text-white">
                  <h3 className="text-3xl font-semibold capitalize">{title}</h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1  text-3xl font-semibold leading-none text-gray-500 outline-none focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="flex h-6 w-6 items-center justify-center bg-transparent text-3xl text-gray-500 outline-none focus:outline-none">
                      &#10799;
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative flex-auto p-4 dark:border-gray-500 dark:bg-gray-800 dark:text-white">
                  {children}
                </div>
                {/*footer*/}
                {footer && (
                  <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-4 dark:border-gray-500 dark:bg-gray-800 dark:text-white">
                    <Button type="button" onClick={onClose}>
                      Close
                    </Button>
                    <Button
                      className={"ml-4 rtl:mr-4"}
                      type="button"
                      onClick={onUpdate}
                    >
                      update
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div
              className="fixed inset-0 z-50 bg-gray-800 opacity-75"
              onClick={onClose}
            ></div>
          </div>
        </>
      )}
    </>
  );
}
