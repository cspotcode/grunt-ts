// Monkey-patch the sys object to store all stdout into memory and invoke a callback instead of exiting the process
var _sysResult;
function _resetSysResult() {
    _sysResult = {
        stdout: '',
        exitCode: 0
    };
}
_resetSysResult();
var _exitCb;
sys.write = function(s) {
    _sysResult.stdout += s;
};
sys.exit = function(exitCode) {
    _sysResult.exitCode = exitCode;
    var ret = {
        stdout: _sysResult.stdout,
        exitCode: _sysResult.exitCode
    };
    _resetSysResult();
    _exitCb(null, ret);
};
sys.getExecutingFilePath = function() {
    return module.filename;
};
// Monkey-patch executeCommandLine to accept a callback.
var _executeCommandLine = ts.executeCommandLine;
ts.executeCommandLine = function(args, exitCb) {
    _exitCb = exitCb;
    _executeCommandLine.call(this, args);
};
// Exports
module.exports = ts;
